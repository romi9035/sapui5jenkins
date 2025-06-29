// Piper Pipeline
@Library('piper-lib-os') _

  stage('SCM') {
    checkout scm
  }

  stage('Fiori-CICD')   {
     fioriOnCloudPlatformPipeline script:this
  }
