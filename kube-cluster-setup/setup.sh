#!/usr/bin/env bash

echo 'Enable Shecan'
ansible-playbook -i hosts shcan.yaml

echo 'Install WARP (VPN)'
ansible-playbook -i hosts install-wiregaurd-warp.yaml

echo 'Install kubernetes dependencies'
ansible-playbook -i hosts kube-dependencies.yaml

echo 'Init master'
ansible-playbook -i hosts init-master.yaml

echo 'Connect slaves to the master'
ansible-playbook -i hosts init-slaves.yaml
