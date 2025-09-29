package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
)

type Config struct {
	Theme       string      `json:"theme"`
	ChartConfig interface{} `json:"chartConfig"`
	Charts      interface{} `json:"charts"`
	Symbols     interface{} `json:"symbols"`
}

var (
	config Config
	mu     sync.RWMutex
)

const configFile = "/data/config.json"

// Default configuration
func getDefaultConfig() Config {
	return Config{
		Theme:       "dark",
		ChartConfig: nil,
		Charts:      nil,
		Symbols:     nil,
	}
}

// Load config from file
func loadConfig() {
	mu.Lock()
	defer mu.Unlock()

	// Try to load from file
	data, err := os.ReadFile(configFile)
	if err != nil {
		log.Printf("Config file not found, using defaults: %v", err)
		config = getDefaultConfig()
		return
	}

	if err := json.Unmarshal(data, &config); err != nil {
		log.Printf("Error parsing config file, using defaults: %v", err)
		config = getDefaultConfig()
		return
	}

	log.Println("Config loaded from file")
}

// Save config to file
func saveConfig() error {
	mu.RLock()
	defer mu.RUnlock()

	// Create data directory if it doesn't exist
	if err := os.MkdirAll("/data", 0755); err != nil {
		return fmt.Errorf("failed to create data directory: %v", err)
	}

	data, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal config: %v", err)
	}

	if err := os.WriteFile(configFile, data, 0644); err != nil {
		return fmt.Errorf("failed to write config file: %v", err)
	}

	return nil
}

// GET /api/config - Get current configuration
func getConfig(w http.ResponseWriter, r *http.Request) {
	mu.RLock()
	defer mu.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(config); err != nil {
		http.Error(w, "Failed to encode config", http.StatusInternalServerError)
		return
	}
}

// PUT /api/config - Update configuration
func updateConfig(w http.ResponseWriter, r *http.Request) {
	var newConfig Config
	if err := json.NewDecoder(r.Body).Decode(&newConfig); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	mu.Lock()
	config = newConfig
	mu.Unlock()

	// Save to file
	if err := saveConfig(); err != nil {
		log.Printf("Failed to save config: %v", err)
		http.Error(w, "Failed to save config", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(config); err != nil {
		http.Error(w, "Failed to encode config", http.StatusInternalServerError)
		return
	}

	log.Println("Config updated and saved")
}

// Health check endpoint
func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

// CORS middleware
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// Simple router
func router() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/config", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			getConfig(w, r)
		case http.MethodPut:
			updateConfig(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/api/health", healthCheck)

	return enableCORS(mux)
}

func main() {
	// Load initial config
	loadConfig()

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, router()))
}
