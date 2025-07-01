@Library('piper-lib-os@v1.446.0') _

pipeline {
    agent any

    environment {
        PIPELINE_CONFIG_FILE = '.pipeline/config.yml'
    }

    stages {

        stage('Setup Environment') {
            steps {
                script {
                    setupCommonPipelineEnvironment script: this
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
            echo "Pipeline failed. Check build logs and config.yml for details."
        }
    }
}