#!/bin/sh
echo "Initializing local sqs"

awslocal sqs create-queue --queue-name ms-recommendation-order-created-queue