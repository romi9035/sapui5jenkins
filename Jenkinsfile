@Library('piper-lib-os') _
node {
  stage('SCM') {
    checkout scm
  }

  stage('Read Config') {
    def config = readYaml file: 'config.yml'
    echo "Parsed Config: ${config}"
  }

  stage('Fiori-CICD') {
    fioriOnCloudPlatformPipeline script: this
  }
}