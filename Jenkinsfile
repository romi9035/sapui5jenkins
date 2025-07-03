pipeline {
    agent any

    environment {
        CF_API      = 'https://api.cf.us10-001.hana.ondemand.com'
        CF_ORG      = 'Next-Wave-Free-Tier'
        CF_SPACE    = 'dev'
        CF_USER     = credentials('cf-username')     // Jenkins credential ID for CF username
        CF_PASSWORD = credentials('cf-password')     // Jenkins credential ID for CF password
        MBT_PATH    = 'C:\\Users\\romagraw\\AppData\\Roaming\\npm'  // NOTE: parent folder of mbt.exe
        CF_PATH     = 'C:\\Program Files\\Cloud Foundry'            // NOTE: parent folder of cf.exe
    }

    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm
                bat 'dir' // Debug: list files
            }
        }

        stage('MTA Build') {
            steps {
                bat '''
                    set PATH=%MBT_PATH%;%PATH%
                    where mbt
                    mbt build -p=cf
                '''
            }
        }

        stage('CF Login') {
            steps {
                bat '''
                    set PATH=%CF_PATH%;%PATH%
                    where cf
                    cf logout
                    cf login -a %CF_API% -u %CF_USER% -p %CF_PASSWORD% -o %CF_ORG% -s %CF_SPACE%
                '''
            }
        }

        stage('CF Deploy') {
            steps {
                bat '''
                    set PATH=%CF_PATH%;%PATH%
                    cf deploy mta_archives\\*.mtar -f
                '''
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