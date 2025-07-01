@Library('piper-lib-os') _

pipeline {
     agent {
        docker {
            image 'ppiper/cf-cli'  // Has cf-cli, mbt, sh
            args '-u root'         // Optional, for permissions
        }
    }

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
            echo 'Cleaning up workspace...'
            cleanWs()
        }

        failure {
            echo 'Pipeline failed. Check build logs and config.yml for details.'
        }
    }
}