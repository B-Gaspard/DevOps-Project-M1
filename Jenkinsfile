pipeline {
    agent {
        label 'Docker-agent'
    }

    environment {
        IMAGE_NAME = "aap-web-portal"
        CONTAINER_NAME = "aap-app"
        PROD_HOST = "192.168.56.12"
        PROD_USER = "vagrant"

        // Configure this as a Secret Text credential in Jenkins
        DISCORD_WEBHOOK = credentials('discord-webhook')
    }

    options {
        timestamps()
        ansiColor('xterm')
    }

    stages {

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "Node version:"
                    node --version

                    echo "NPM version:"
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

        stage('Build Image') {
            steps {
                sh '''
                    docker version

                    docker build \
                        -t ${IMAGE_NAME}:${BUILD_NUMBER} \
                        .

                    docker tag \
                        ${IMAGE_NAME}:${BUILD_NUMBER} \
                        ${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Deploy to Production') {
            steps {
                sh '''
                    echo "Deploying to Production Server..."

                    ssh \
                      -o StrictHostKeyChecking=no \
                      ${PROD_USER}@${PROD_HOST} <<EOF

                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true

                    docker run -d \
                      --name ${CONTAINER_NAME} \
                      -p 8080:8080 \
                      ${IMAGE_NAME}:latest

                    sleep 10

                    echo "Smoke Test"

                    if command -v curl >/dev/null 2>&1; then
                        STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080)
                    else
                        STATUS=$(wget --server-response --spider http://localhost:8080 2>&1 | awk '/HTTP\\// {print \$2}' | tail -1)
                    fi

                    echo "HTTP Status: ${STATUS}"

                    test -n "${STATUS}"

                    EOF
                '''
            }
        }
    }

    post {
        always {
            sh '''
                curl \
                  -H "Content-Type: application/json" \
                  -X POST \
                  -d "{
                        \\"build\\": \\"${BUILD_ID}\\",
                        \\"build_number\\": \\"${BUILD_NUMBER}\\",
                        \\"job\\": \\"${JOB_NAME}\\",
                        \\"status\\": \\"${currentBuild.currentResult}\\"
                      }" \
                  "${DISCORD_WEBHOOK}"
            '''
        }
    }
}