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
                echo 'Building production application container image...'
                sh 'docker build -t aap-web-portal:${BUILD_NUMBER} .'
            }
        }
        
        stage('Deploy to Production Server (VM3)') {
            steps {
                echo 'Deploying application container remotely to VM3...'
                sh '''
                echo "Simulating secure remote transfer and startup execution on VM3 (192.168.56.12)..."
                # In a live corporate run, we push to a registry and run a clean docker run command on VM3 here
                '''
            }
        }
    }
}