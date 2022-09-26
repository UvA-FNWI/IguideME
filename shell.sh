#!/usr/bin/env bash

PROJECT_ROOT=$PWD;

if [ ! -d $PWD/IguideME.Web/wwwroot/node_modules ]; then
  echo "Fetching node modules..."
  cd $PWD/IguideME.Web/wwwroot || exit;
  yarn;
  cd $PWD || exit;
fi

KUBECTL_PROJ_ID=$(kubectl get pods -n iguideme | grep Running | awk '{print $1}')

alias build-frontend-watch='yarn --cwd $PROJECT_ROOT/IguideME.Web/wwwroot/ start';
alias build-frontend-prod='yarn --cwd $PROJECT_ROOT/IguideME.Web/wwwroot/ build';
alias build-backend-watch='dotnet watch --project $PROJECT_ROOT/IguideME.Web/ run';
alias build-backend-prod='dotnet build --project $PROJECT_ROOT/IguideME.Web/';
alias enter-db='litecli $PROJECT_ROOT/IguideME.Web/db.sqlite';
alias logs='kubectl logs $KUBECTL_PROJ_ID -n iguideme';
alias refresh-logs='KUBECTL_PROJ_ID=$(kubectl get pods -n iguideme | grep Running | awk '\''{print $1}'\'')'
alias h='display_help';

display_help () {
  echo "You can use the following assist commands:";
  echo "                                          ";
  echo "  ---frontend-----------------------------";
  echo "  build-frontend-watch    build the frontend (watch for changes)";
  echo "  build-frontend-prod     build the frontend for production";
  echo "                                          ";
  echo "  ---backend------------------------------";
  echo "  build-backend-watch     build the backend (watch for changes)";
  echo "  build-backend-prod      build the backend for production";
  echo "                                          ";
  echo "  ---administrative-----------------------";
  echo "  kill-process            kill a process by name";
  echo "  enter-db                enter the database";
  echo "  logs                    view production logs";
  echo "  refresh-logs            refresh pod name for logs";
  echo "                                          ";
  echo "  ---misc---------------------------------";
  echo "  h                       display this message again";
  echo "                                          ";
}

# clear screen
printf "\033c"

cat << EOF
IIIII                 iii      dd        MM    MM EEEEEEE
 III   gggggg uu   uu          dd   eee  MMM  MMM EE
 III  gg   gg uu   uu iii  dddddd ee   e MM MM MM EEEEE
 III  ggggggg uu   uu iii dd   dd eeeee  MM    MM EE
IIIII      gg  uuuu u iii  dddddd  eeeee MM    MM EEEEEEE
       ggggg


EOF

display_help;
