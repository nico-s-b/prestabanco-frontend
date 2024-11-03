pipeline {
    agent any
    tools{
        maven 'maven'
    }
    stages{
        stage('Build maven'){
            steps{
               checkout([$class: 'GitSCM', 
                    branches: [[name: '*/main']], 
                    extensions: [], 
                    userRemoteConfigs: [[
                        url: 'https://github.com/nico-s-b/prestabanco-frontend', 
                        credentialsId: 'github-token'
                    ]]
                ])
                bat 'npm install'
                bat 'npm run build'
            }
        }

        stage('Build docker image'){
            steps{
                script{
                    bat 'docker build -t nicolassepulvedab/prestabanco-frontend .'
                }
            }
        }
        stage('Push image to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'
                    }
                    bat 'docker push nicolassepulvedab/prestabanco-frontend'
                }
            }
        }
    }
}