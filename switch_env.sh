#!/bin/bash

ENVIRONMENT=$1
STAGING=jumga-staging
PROD=jumga-production

case $ENVIRONMENT in

    stage | staging | Stage | Staging)
      echo -n "switching to staging"
      echo ""
      firebase use $STAGING
		;;

    prod | production | Prod | Production)
      echo -n "run for production"
      echo ""
      firebase use $PROD
    ;;

    *)
      echo -n "run for staging AS default"
      echo ""
      firebase use $STAGING
    ;;

esac