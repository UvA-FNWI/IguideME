#!/usr/bin/env bash

PROJECT_ROOT=$PWD;

if [ ! -d $PWD/IguideME.Web/wwwroot/node_modules ]; then
  echo "Fetching node modules..."
  cd $PWD/IguideME.Web/wwwroot || exit;
  yarn;
  cd $PWD || exit;
fi

#KUBECTL_PROJ_ID=$(kubectl get pods -n iguideme | grep Running | awk '{print $1}')

alias frontend-dev='yarn --cwd $PROJECT_ROOT/IguideME.Web/Frontend dev'
alias frontend-update-packages='yarn --cwd $PROJECT_ROOT/IguideME.Web/Frontend install'
# alias frontend-prod='yarn --cwd $PROJECT_ROOT/IguideME.Web/Frontend build'
alias backend-dev='dotnet watch --project $PROJECT_ROOT/IguideME.Web/ --no-hot-reload';
alias enter-db='litecli $PROJECT_ROOT/IguideME.Web/db.sqlite';
alias logs='kubectl logs $KUBECTL_PROJ_ID -n iguideme';
alias refresh-logs='KUBECTL_PROJ_ID=$(kubectl get pods -n iguideme | grep Running | awk '\''{print $1}'\'')'
alias h='display_help';

display_help () {
  echo "You can use the following assist commands:";
  echo "                                          ";
  echo "  ---frontend-----------------------------";
  echo "  frontend-dev              build the frontend (watch for changes)";
  echo "  frontend-update-packages  update/install node modules for the packages";
  echo "                                          ";
  echo "  ---backend------------------------------";
  echo "  backend-dev 	            build the backend (watch for changes)";
  echo "                                          ";
  echo "  ---administrative-----------------------";
  echo "  kill-process              kill a process by name";
  echo "  enter-db                  enter the database";
  echo "  logs                      view production logs";
  echo "  refresh-logs              refresh pod name for logs";
  echo "                                          ";
  echo "  ---misc---------------------------------";
  echo "  h                       display this message again";
  echo "                                          ";
}

# clear screen
# printf "\033c"

cat << EOF
IIIII                 iii      dd        MM    MM EEEEEEE
 III   gggggg uu   uu          dd   eee  MMM  MMM EE
 III  gg   gg uu   uu iii  dddddd ee   e MM MM MM EEEEE
 III  ggggggg uu   uu iii dd   dd eeeee  MM    MM EE
IIIII      gg  uuuu u iii  dddddd  eeeee MM    MM EEEEEEE
       ggggg


EOF

display_help;
