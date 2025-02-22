pipeline {
    agent any

    environment {
        BACKUP_FILE = "${env.WORKSPACE}/${sh(script: 'date +%Y-%m-%d', returnStdout: true).trim()}_strapi.tar.gz"
        GIT_SSH_CREDENTIALS_ID = '3f756e47-9b94-4cf6-a18b-8d8a0ef98657'
        GIT_SOURCE_REPO = 'git@github.com:shipitlive/shipitlive_strapy_backend.git'
        GIT_BACKUP_REPO = 'git@github.com:shipitlive/shipitlive-data-backup.git'
        
    }

    stages {
        stage('Clone Strapi Project') {
            steps {
                sshagent (credentials: [env.GIT_SSH_CREDENTIALS_ID]) {
                    sh 'git clone $GIT_SOURCE_REPO strapi-project'
                }
            }
        }

        stage('Take Backup of Strapi Data') {
            steps {
                dir('strapi-project') {
                    sh 'npm install'
                    sh 'npm run strapi export --file $BACKUP_FILE'
                }
            }
        }

        stage('Push Backup to Git') {
            steps {
                sshagent (credentials: [env.GIT_SSH_CREDENTIALS_ID]) {
                    sh '''
                    mkdir -p backup-repo
                    cd backup-repo
                    git clone $GIT_BACKUP_REPO .
                    mv $BACKUP_FILE .
                    git add .
                    git commit -m "Backup: $(date +%Y-%m-%d)"
                    git push origin main
                    '''
                }
            }
        }

        stage('Cleanup') {
            steps {
                sh 'rm -rf strapi-project backup-repo $BACKUP_FILE'
            }
        }
    }

    post {
        success {
            echo "🎉 Backup and push completed successfully!"
        }
        failure {
            echo "❌ Something went wrong! Check logs."
        }
    }
}
