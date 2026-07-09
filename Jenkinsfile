pipeline {
    agent {
        label 'Docker-agent'
    }

    environment {
        PROD_SERVER     = '192.168.56.12'
        IMAGE_NAME      = "aap-web-portal:${env.BUILD_NUMBER}"
        DISCORD_WEBHOOK = '***REMOVED***'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Provisioning runtime dependencies (Node.js & npm)...'
                sh 'apk add --no-cache nodejs npm'
                
                echo 'Installing application dependencies...'
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Executing test suite...'
                sh 'npm test'
            }
        }

        stage('Build Image') {
            steps {
                echo "Compiling application Docker image: ${IMAGE_NAME}..."
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Deploy to Production') {
            steps {
                echo "Deploying application to production server (${PROD_SERVER})..."
                sh """
                    ssh -o StrictHostKeyChecking=no vagrant@${PROD_SERVER} "
                        docker stop aap-app || true
                        docker rm aap-app || true
                        docker run -d --name aap-app -p 8080:8080 ${IMAGE_NAME}
                    "
                """
            }
        }

        stage('Telemetry & Metric Validation') {
            steps {
                echo "Querying CPU metrics on production target VM3..."
                script {
                    def loadAvgStr = sh(
                        script: "ssh -o StrictHostKeyChecking=no vagrant@${PROD_SERVER} \"awk '{print \$1}' /proc/loadavg\"", 
                        returnStdout: true
                    ).trim()
                    
                    double loadAvg = Double.parseDouble(loadAvgStr)
                    echo "Current 1-Minute Load Average: ${loadAvg}"

                    if (loadAvg > 0.50) {
                        echo "WARNING: High CPU load threshold breached!"
                        def alertPayload = """
                        {
                            "content": "⚠️ **CRITICAL WARNING**: Host VM3 (Production) CPU usage has reached over 50%! Current load average: ${loadAvg}."
                        }
                        """
                        sh """
                            curl -H "Content-Type: application/json" -X POST -d '${alertPayload}' \${DISCORD_WEBHOOK}
                        """
                    }
                }
            }
        }

        stage('Post-Deploy Verification') {
            steps {
                echo 'Setting up Robot Framework test automation environment...'
                sh """
                    apk add --no-cache python3 py3-pip gcc python3-dev musl-dev libffi-dev openssl-dev
                    python3 -m venv venv
                    . venv/bin/activate
                    pip install --upgrade pip
                    pip install robotframework robotframework-seleniumlibrary
                """
                
                echo 'Executing advanced Robot Framework UI component validation...'
                sh """
                    . venv/bin/activate
                    robot --variable PROD_IP:${PROD_SERVER} web_smoke_test.robot
                """
            }
        }
    }

    post {
        always {
            script {
                def webhookUrl = env.DISCORD_WEBHOOK ?: 'https://discord.com/api/webhooks/fallback-if-empty'
                def currentStatus = currentBuild.currentResult ?: 'ABORTED'
                def embedColor = (currentStatus == 'SUCCESS') ? 3066993 : 15158332
                
                def payload = """
                {
                    "content": "Pipeline execution completed.",
                    "embeds": [{
                        "title": "Build #${env.BUILD_NUMBER} Status",
                        "description": "Project: DevOps-Project-M1\\nBranch: main",
                        "color": ${embedColor},
                        "fields": [
                            { "name": "Build ID", "value": "${env.BUILD_NUMBER}", "inline": true },
                            { "name": "Result Status", "value": "${currentStatus}", "inline": true }
                        ]
                    }]
                }
                """
                sh """
                    curl -H "Content-Type: application/json" -X POST -d '${payload}' \${webhookUrl}
                """
            }
        }
    }
}