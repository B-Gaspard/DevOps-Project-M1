pipeline {
    agent {
        node {
            label 'Docker-agent' 
        }
    }

    stages {
        stage('Install Dependencies') {
            agent {
                dockerContainer {
                    image 'node:22-alpine'
                }
            }
            steps {
                echo 'Installing development dependencies...'
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            agent {
                dockerContainer {
                    image 'node:22-alpine'
                }
            }
            steps {
                echo 'Executing unit test suite...'
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                echo 'Building production application container image...'
                sh 'docker build -t aap-web-portal:latest .'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying to live environment...'
                sh '''
                docker rm -f aap-app || true
                docker run -d --name aap-app -p 8082:8080 aap-web-portal:latest
                sleep 3
                echo "Running smoke test..."
                curl -s -o /dev/null -w "%{http_code}" http://localhost:8082
                '''
            }
        }
    }
}