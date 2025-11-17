FROM node:12

# This command first finds Yarn's global directory, ensures it exists,
# then creates a package.json file with the specific version resolution for 'tmp',
# and finally, installs gatsby-cli.
# These specific versions are needed as a temporary solution for running on node 12.
RUN yarn global dir | xargs -I {} sh -c 'mkdir -p {} && echo "{\"private\": true, \"resolutions\": {\"tmp\": \"0.2.1\"}}" > {}/package.json' && \
    yarn global add gatsby-cli@^3
