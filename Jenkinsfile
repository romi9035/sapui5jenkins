@Library('piper-lib-os') _

node() {
    stage('Prepare') {
        checkout([
            $class: 'GitSCM',
            branches: [[name: '*/main']],
            userRemoteConfigs: [[url: 'https://github.com/romi9035/sapui5jenkins.git']],
            extensions: [[$class: 'CloneOption', noTags: false, shallow: false, depth: 0]]
        ])

        bat 'dir'
        bat 'dir .pipeline'
        bat 'type .pipeline\\config.yml'

        setupCommonPipelineEnvironment script: this, customDefaults: ['file:.pipeline/config.yml']
    }

    stage('Build') {
        mtaBuild script: this
    }

    stage('Deploy') {
        cloudFoundryDeploy script: this
    }
}