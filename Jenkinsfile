@Library('piper-lib-os@v1.446.0') _

pipeline {
    agent any

    environment {
        PIPELINE_CONFIG_FILE = '.pipeline/config.yml'
    }

    stages {

        stage('Load Configuration') {
            steps {
                script {
                    // Load pipeline config file
                    pipelineEnv = loadPipelineEnvironment()
                    config = loadEffectivePipelineConfiguration()
                }
            }
        }

        stage('MTA Build') {
            steps {
                script {
                    mtaBuild script: this
                }
            }
        }

        stage('Cloud Foundry Deploy') {
            steps {
                script {
                    cloudFoundryDeploy script: this
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up workspace..."
            cleanWs()
        }

        failure {
            script {
                debugReport script: this
            }
        }
    }
}