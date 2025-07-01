@Library('piper-lib-os') _

node {
    stage('Prepare') {
        checkout scm

        echo "=====> Running setupCommonPipelineEnvironment"
        setupCommonPipelineEnvironment script: this

        echo "=====> Trying to read config manually"
        def config = readYaml file: '.pipeline/config.yml'
        echo "=====> config.yml content: ${config}"

        echo "=====> Setup complete"
    }

    stage('Build MTA') {
        mtaBuild script: this
    }

    stage('Deploy to CF') {
        cloudFoundryDeploy script: this
    }
}
