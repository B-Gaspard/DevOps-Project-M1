pipeline {
    agent {
        label 'Docker-agent'
    }

    environment {
        IMAGE_NAME = 'aap-web-portal'
        CONTAINER_NAME = 'aap-app'

        PROD_HOST = '192.168.56.12'
        PROD_USER = 'vagrant'

        SSH_KEY = '/home/jenkins/.ssh/id_rsa'

        WEBHOOK_URL = credentials('discord-webhook')
    }

    options {
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    node --version
                    npm --version

                    npm install
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    npm test
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker version

                    docker build \
                      -t ${IMAGE_NAME}:${BUILD_NUMBER} .

                    docker tag \
                      ${IMAGE_NAME}:${BUILD_NUMBER} \
                      ${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Transfer Image') {
            steps {
                sh '''
                    docker save ${IMAGE_NAME}:latest | gzip > image.tar.gz

                    scp \
                      -i ${SSH_KEY} \
                      -o StrictHostKeyChecking=no \
                      image.tar.gz \
                      ${PROD_USER}@${PROD_HOST}:/tmp/
                '''
            }
        }

        stage('Deploy to Production') {
            steps {
                sh '''
                    ssh \
                      -i ${SSH_KEY} \
                      -o StrictHostKeyChecking=no \
                      ${PROD_USER}@${PROD_HOST} << EOF

                    docker load < /tmp/image.tar.gz

                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true

                    docker run -d \
                        --restart unless-stopped \
                        --name ${CONTAINER_NAME} \
                        -p 8080:8080 \
                        ${IMAGE_NAME}:latest

                    sleep 10

                    if command -v curl >/dev/null 2>&1
                    then
                        STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080)
                    else
                        STATUS=$(wget --server-response --spider http://localhost:8080 2>&1 | awk '/HTTP/{print $2}' | tail -1)
                    fi

                    echo "HTTP Status: $STATUS"

                    test "$STATUS" = "200"

                    EOF
                '''
            }
        }
    }

    post {

        success {
            echo "Deployment successful."
        }

        failure {
            echo "Deployment failed."
        }

        always {
            sh '''
            curl \
              -H "Content-Type: application/json" \
              -X POST \
              -d '{
                    "build":"'"${BUILD_NUMBER}"'",
                    "job":"'"${JOB_NAME}"'",
                    "status":"'"${currentBuild.currentResult}"'"
                  }' \
              "${WEBHOOK_URL}"
            '''
        }
    }
}