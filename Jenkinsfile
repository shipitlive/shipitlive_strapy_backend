pipeline {
    agent any  

    tools {
        nodejs 'nodejs-jenkins'  // Use the configured Node.js version
    }

    environment {
        BACKUP_DATE = sh(script: 'date +%Y-%m-%d', returnStdout: true).trim()
        BACKUP_FILE = "${BACKUP_DATE}_strapi"
        GIT_SOURCE_REPO = 'git@github.com:shipitlive/shipitlive_strapy_backend.git'
        GIT_BACKUP_REPO = 'git@github.com:shipitlive/shipitlive-data-backup.git'
    }

    stages {
        stage('Check Environment Variables') {
            steps {
                sh 'printenv | sort'
            }
        }

        stage('Clone Strapi Project') {
            steps {
                sshagent(['jenkins']) {
                    sh '''
                    if [ -d "strapi-project" ]; then
                        echo "🛑 strapi-project directory already exists. Deleting it..."
                        rm -rf strapi-project
                    fi
                    git clone "$GIT_SOURCE_REPO" strapi-project
                    '''
                }
            }
        }

        stage('Take Backup of Strapi Data') {
            steps {
                dir('strapi-project') {
                    sh '''
                    set -e  # Exit on error
                    echo "✅ Running npm install..."
                    npm install
                    
                    echo "✅ Exporting environment variables..."
                    printenv | grep -E 'APP_KEYS|HOST|JWT_SECRET|PORT|TRANSFER_TOKEN_SALT|API_TOKEN_SALT|ADMIN_JWT_SECRET|DATABASE_HOST|DATABASE_PORT|DATABASE_NAME|DATABASE_USERNAME|DATABASE_PASSWORD|NODE_ENV|DATABASE_CLIENT' | while read line; do
                        echo "export $line" >> strapi-env.sh
                    done
                    chmod +x strapi-env.sh
                    . ./strapi-env.sh

                    echo "✅ Starting Strapi export..."
                    npm run strapi export -- --no-encrypt --file="$WORKSPACE/$BACKUP_FILE"

                    if [ ! -f "$WORKSPACE/$BACKUP_FILE" ]; then
                        echo "❌ Backup file was not created!"
                        exit 1
                    fi

                    echo "✅ Backup created: $WORKSPACE/$BACKUP_FILE"
                    '''
                }
            }
        }

        stage('Push Backup to Git') {
            steps {
                sshagent(['jenkins']) {
                    sh '''
                    set -e  # Exit on error
                    if [ -d "backup-repo/.git" ]; then
                        echo "✅ Backup repository already exists. Pulling latest changes..."
                        cd backup-repo
                        git reset --hard
                        git pull origin main || git pull origin master || echo "⚠️ No remote branch found!"
                    else
                        echo "✅ Cloning backup repository..."
                        rm -rf backup-repo
                        git clone "$GIT_BACKUP_REPO" backup-repo || { echo "❌ Failed to clone repo!"; exit 1; }
                    fi

                    echo "✅ Moving backup file into the repository..."
                    mv "$WORKSPACE/$BACKUP_FILE" "backup-repo/" || { echo "❌ Backup file not found!"; exit 1; }

                    cd backup-repo

                    echo "✅ Configuring Git user..."
                    git config --local user.name "Jenkins CI"
                    git config --local user.email "jenkins@shipitlive.dev"

                    echo "✅ Committing and pushing the backup..."
                    git add .
                    git commit -m "Backup: $(date +%Y-%m-%d)"
                    git push origin main || git push origin master
                    '''
                }
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                echo "🧹 Cleaning up..."
                rm -rf strapi-project backup-repo "$WORKSPACE/$BACKUP_FILE"
                echo "✅ Cleanup done."
                '''
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
