#!/bin/bash

cd /app;

if [[ ! -d "/app/node_modules" ]] ; then
    yarn;
fi;

yarn $@
