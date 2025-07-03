pipeline {
    agent any

    environment {
        CF_API      = 'https://api.cf.us10-001.hana.ondemand.com'
        CF_ORG      = 'Next-Wave-Free-Tier'
        CF_SPACE    = 'dev'
        CF_USER     = credentials('cf-username')
        CF_PASSWORD = credentials('cf-password')

        PATH = "C:\\Users\\romagraw\\AppData\\Roaming\\npm;C:\\Program Files\\Cloud Foundry;${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm
                bat 'dir'
            }
        }

        stage('MTA Build') {
            steps {
                bat 'mbt build -p=cf'
            }
        }

        stage('Install MultiApps Plugin') {
            steps {
                bat 'cf install-plugin -f -r CF-Community "multiapps"'
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
