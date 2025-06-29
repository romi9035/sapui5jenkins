// Piper Pipeline
@Library('piper-lib-os') _

pipeline {
  agent any

  stages {
    stage('SCM') {
      steps {
        checkout scm
      }
    }

    stage('Fiori-CICD') {
      steps {
        script {
          fioriOnCloudPlatformPipeline script: this
        }
      }
    }
  }
}
