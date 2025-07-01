@Library('piper-lib-os') _

node() {
    stage('Prepare') {
        // Force full checkout to ensure .pipeline/config.yml is available
        checkout([
            $class: 'GitSCM',
            branches: [[name: '*/main']],
            userRemoteConfigs: [[url: 'https://github.com/romi9035/sapui5jenkins.git']],
            extensions: [[$class: 'CloneOption', noTags: false, shallow: false]]
        ])

        // Windows version of the file checks
        bat 'dir .pipeline'
        bat 'type .pipeline\\config.yml'

        setupCommonPipelineEnvironment script: this
    }

    stage('Build') {
        mtaBuild script: this
    }

    stage('Deploy') {
        cloudFoundryDeploy script: this
    }
}