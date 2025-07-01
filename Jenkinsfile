pipeline {
    agent any

    environment {
        CF_API      = 'https://api.cf.us10-001.hana.ondemand.com'
        CF_ORG      = 'Next-Wave-Free-Tier'
        CF_SPACE    = 'dev'
        CF_USER     = credentials('cf-username') // Jenkins credential ID
        CF_PASSWORD = credentials('cf-password') // Jenkins credential ID
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('MTA Build') {
            steps {
                bat 'mbt build -p=cf'
            }
        }

        stage('CF Login') {
            steps {
                bat """
                    cf logout
                    cf login -a %CF_API% -u %CF_USER% -p %CF_PASSWORD% -o %CF_ORG% -s %CF_SPACE%
                """
            }
        }

        stage('CF Deploy') {
            steps {
                bat 'cf deploy mta_archives\\*.mtar -f'
            }
        }
    }

    post {
        always {
            cleanWs()
        }

        failure {
            echo '❌ Pipeline failed. Check the logs for errors.'
        }

        success {
            echo '✅ Application deployed to Cloud Foundry successfully!'
        }
    }
}