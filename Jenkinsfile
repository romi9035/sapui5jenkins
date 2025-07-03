pipeline {
    agent any

    environment {
        // Cloud Foundry settings
        CF_API      = 'https://api.cf.us10-001.hana.ondemand.com'
        CF_ORG      = 'Next-Wave-Free-Tier'
        CF_SPACE    = 'dev'
        CF_USER     = credentials('cf-username')
        CF_PASSWORD = credentials('cf-password')

        // Ensure PATH includes mbt and cf tools
        PATH = "C:\\Users\\romagraw\\AppData\\Roaming\\npm;C:\\Program Files\\Cloud Foundry;${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm
                bat 'dir' // Debug: list contents
            }
        }

        stage('MTA Build (No Make)') {
            steps {
                bat 'mbt build -t mta_archives --mtar myapp.mtar --platform cf'
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
                bat 'cf deploy mta_archives\\myapp.mtar -f'
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
