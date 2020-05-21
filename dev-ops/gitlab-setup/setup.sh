#!/usr/bin/env bash

helm install k8-docker-alpha gitlab/gitlab-runner -f runner-config.yaml
helm install k8-docker-bravo gitlab/gitlab-runner -f runner-config.yaml
helm install k8-docker-charlie gitlab/gitlab-runner -f runner-config.yaml