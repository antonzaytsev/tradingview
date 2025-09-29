# Build stage
FROM golang:1.21-alpine AS builder

RUN apk add --no-cache ca-certificates

# Set build environment to force using module proxy without VCS
ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOPROXY=https://proxy.golang.org
ENV GOSUMDB=sum.golang.org
ENV GOPRIVATE=""

WORKDIR /app

# Copy all source files
COPY . .

# Build the application (this will automatically download modules from proxy)
RUN go mod tidy && go build -v -o main .

# Final stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/

# Create data directory
RUN mkdir -p /data

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
