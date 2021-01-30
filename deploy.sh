#!/bin/bash

(cd client && yarn build)
gcloud app deploy
