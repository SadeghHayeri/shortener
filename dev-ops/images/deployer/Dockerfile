FROM alpine
RUN apk add curl
RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.11.5/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl