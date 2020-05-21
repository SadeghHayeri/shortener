#!/usr/bin/env bash

helm uninstall k8-docker-alpha
helm uninstall k8-docker-bravo
helm uninstall k8-docker-charlie
helm uninstall k8-deployer-delta

helm install k8-docker-alpha gitlab/gitlab-runner -f k8-docker-config.yaml
helm install k8-docker-bravo gitlab/gitlab-runner -f k8-docker-config.yaml
helm install k8-docker-charlie gitlab/gitlab-runner -f k8-docker-config.yaml
helm install k8-deployer-alpha gitlab/gitlab-runner -f k8-deployer-config.yaml
