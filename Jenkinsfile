pipeline {
    agent {
        node {
            label 'Docker-agent' 
        }
    }

    stages {
        stage('Environment Setup') {
            steps {
                echo 'Dynamically installing Node.js and NPM inside the agent...'
                sh 'sudo apk add --no-cache nodejs npm'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing development dependencies...'
                sh 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Executing unit test suite...'
                sh 'npm test'
            }
        }
        
        stage('Build Image') {
            steps {
                echo 'Building production application container image...'
                sh 'docker build -t aap-web-portal:latest .'
            }
        }
        
        stage('Deploy to Production') {
            steps {
                echo 'Deploying application to production server...'
                sh '''
                docker rm -f aap-app || true
                docker run -d --name aap-app -p 8082:8080 aap-web-portal:latest
                sleep 3
                echo "Running smoke test validation..."
                curl -s -o /dev/null -w "%{http_code}" http://localhost:8082 || wget -qO- http://localhost:8082
                '''
            }
        }
    }
}