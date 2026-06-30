pipeline {
    agent {
        node {
            label 'Docker-agent' 
        }
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing...'
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                echo 'Executing tests...'
                sh 'npm test'
            }
        }
        stage('Build') {
            steps {
                echo 'Building production container image...'
                sh 'docker build -t aap-web-portal:latest .'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying to application stack...'
                sh '''
                docker rm -f aap-app || true
                docker run -d --name aap-app -p 8082:8080 aap-web-portal:latest
                echo "Testing post deployment..."
                curl -s -o /dev/null -w "%{http_code}" http://localhost:8082
                '''
            }
        }
    }
}