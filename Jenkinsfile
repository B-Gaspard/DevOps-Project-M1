pipeline {
    agent {
        label 'docker-dynamic-agent'
    }
    
    environment {
        APP_NAME     = 'devops-uni-app'
        IMAGE_TAG    = "${BUILD_NUMBER}"
        PROD_SERVER  = '192.168.56.12'
        PROD_USER    = 'vagrant'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out Source Code Repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Running npm install...'
                sh 'npm install'
            }
        }

        stage('Unit Test') {
            steps {
                echo 'Executing Application Test Suites...'
                sh 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Application Container Artifact...'
                sh "docker build -t ${APP_NAME}:${IMAGE_TAG} ."
                echo 'Packaging and Saving container to tarfile...'
                sh "docker save ${APP_NAME}:${IMAGE_TAG} | gzip > ${APP_NAME}.tar.gz"
            }
        }

        stage('Deployment') {
            steps {
                sshagent(credentials: ['vm-ssh-key']) {
                    echo "Transferring application image archive to Production (${PROD_SERVER})..."
                    sh "ssh -o StrictHostKeyChecking=no ${PROD_USER}@${PROD_SERVER} 'docker stop ${APP_NAME} || true && docker rm ${APP_NAME} || true'"
                    sh "scp -o StrictHostKeyChecking=no ${APP_NAME}.tar.gz ${PROD_USER}@${PROD_SERVER}:/tmp/"
                    
                    echo 'Loading image archive and booting application on production node...'
                    sh "ssh -o StrictHostKeyChecking=no ${PROD_USER}@${PROD_SERVER} 'gunzip -c /tmp/${APP_NAME}.tar.gz | docker load'"
                    sh "ssh -o StrictHostKeyChecking=no ${PROD_USER}@${PROD_SERVER} 'docker run -d --name ${APP_NAME} -p 3000:3000 ${APP_NAME}:${IMAGE_TAG}'"
                    sh "ssh -o StrictHostKeyChecking=no ${PROD_USER}@${PROD_SERVER} 'rm /tmp/${APP_NAME}.tar.gz'"
                }
            }
        }

        stage('Smoke Test') {
            steps {
                echo 'Running endpoint functional availability validation healthcheck...'
                script {
                    def retries = 5
                    def success = false
                    while(retries > 0 && !success) {
                        try {
                            def response = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://${PROD_SERVER}:3000", returnStdout: true).trim()
                            if (response == "200") {
                                echo "Smoke test successful! Status code: ${response}"
                                success = true
                            } else {
                                echo "Response code was ${response}. Retrying..."
                                sleep 5
                                retries--
                            }
                        } catch (Exception e) {
                            echo "Connection dropped. Retrying..."
                            sleep 5
                            retries--
                        }
                    }
                    if (!success) {
                        error "Smoke Test Failed: Application is unreachable or returned a non-200 response code."
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                def status = currentBuild.currentResult
                def color = (status == 'SUCCESS') ? 3066993 : 15158332
                def message = "Pipeline Status: ${status} | Job: ${env.JOB_NAME} | Build: #${env.BUILD_NUMBER}\nURL: ${env.BUILD_URL}"
                
                withCredentials([string(credentialsId: 'discord-webhook', variable: 'DISCORD_URL')]) {
                    sh """
                    curl -H "Content-Type: application/json" \
                         -X POST \
                         -d '{"embeds": [{"title": "CI/CD Notification", "description": "${message}", "color": ${color}}]}' \
                         \${DISCORD_URL}
                    """
                }
            }
        }
    }
}