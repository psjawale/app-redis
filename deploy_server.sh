#!/bin/bash
echo "Configuring and deploying software to the production environment"
inventoryPath=/Users/Pooja_Jawale/Devops/Milestone-3/aws-instance/Inventory
ansible-playbook -i $inventoryPath //Users/Pooja_Jawale/Devops/Milestone-3/aws-instance/setup.yml
ansible-playbook -i $inventoryPath /Users/Pooja_Jawale/Devops/Milestone-3/aws-instance/deploy.yml
