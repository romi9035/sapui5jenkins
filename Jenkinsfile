@Library('piper-lib-os@v1.446.0') _

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

        // 💡 Use this to avoid path issues
        setupCommonPipelineEnvironment(
            script: this,
            customDefaultsFromFiles: ['.pipeline/config.yml']
        )
    }

    stage('Build') {
        mtaBuild script: this
    }

    stage('Deploy') {
        cloudFoundryDeploy script: this
    }
}