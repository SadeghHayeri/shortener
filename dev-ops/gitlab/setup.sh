#!/usr/bin/env bash

helm uninstall k8-docker-genernator
helm uninstall k8-deployer-genernator

helm install k8-docker-genernator gitlab/gitlab-runner -f k8-docker-config.yaml
helm install k8-deployer-genernator gitlab/gitlab-runner -f k8-deployer-config.yaml
