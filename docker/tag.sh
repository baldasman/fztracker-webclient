#!/usr/bin/env bash
. "$(pwd)/$(dirname $0)/utils.sh"

# Expected ENV variables
# Mandatory:
# DOCKER_USERNAME
# DOCKER_PASSWORD
# REGISTRY_HOST     example: domatica.no-ip.org:1080 
# REGISTRY_PROJECT  example: idomlive
# REGISTRY_NAME     example: idomlive-gui-tool
#
# Params:
# $1                [ staging | prod ]

if [ -z $DOCKER_USERNAME ] || [ -z $DOCKER_PASSWORD ] || [ -z $REGISTRY_HOST ] || [ -z $REGISTRY_PROJECT ] || [ -z $REGISTRY_NAME ]
then
  echo "ERROR: Environment variables missing! Please supply: \$DOCKER_USERNAME, \$DOCKER_PASSWORD, \$REGISTRY_HOST, \$REGISTRY_PROJECT, \$REGISTRY_NAME."
  exit 1
fi

STAGE=$1

# Local variables
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
NC=$(tput sgr0)

echo "Building: $STAGE"
case $STAGE in
  staging)
    FROM_TAG=latest
    TO_TAG=staging
  ;;   # double semicolon closes branch

  prod)
    FROM_TAG=staging
    TO_TAG=stable
  ;;   # double semicolon closes branch
esac

if [ -z $FROM_TAG ] || [ -z $TO_TAG ]
then
  echo "Please supply \$FROM_TAG and \$TO_TAG env variables!"
  exit 1
fi

echo -e "Deploying images '$FROM_TAG' to '$TO_TAG'...\n"

docker-login
tag-new-image
docker-logout

echo -e "\nDONE!"
exit 0
