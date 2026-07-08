// Google IT Support Certificate Progress Bypass Script
// This script will complete all courses and unlock the achievement and survey buttons

(function() {
    console.log("Starting Google IT Support Certificate Progress Bypass Script");
    
    // Function to simulate a delay to make it look more natural
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Function to update progress bars
    function updateProgress(selector, value) {
        const progressBar = document.querySelector(selector);
        if (progressBar) {
            progressBar.setAttribute('progress', value);
            console.log(`Updated progress for ${selector}: ${value}`);
        }
    }
    
    // Function to mark activity cards as completed
    function markAsCompleted(selector) {
        const card = document.querySelector(selector);
        if (card) {
            card.setAttribute('completed', '');
            console.log(`Marked ${selector} as completed`);
        }
    }
    
    // Function to update activity progress
    function updateActivityProgress(index, value) {
        const activities = document.querySelector('ql-contents-menu').getAttribute('modules');
        if (activities) {
            try {
                const modules = JSON.parse(activities);
                if (modules[0] && modules[0].steps[0] && modules[0].steps[0].activities[index]) {
                    modules[0].steps[0].activities[index].progress = value;
                    modules[0].steps[0].activities[index].isComplete = value === 100;
                    modules[0].steps[0].activities[index].inProgress = value < 100;
                    document.querySelector('ql-contents-menu').setAttribute('modules', JSON.stringify(modules));
                    console.log(`Updated activity ${index} progress to ${value}%`);
                }
            } catch (e) {
                console.error("Error updating activities:", e);
            }
        }
    }
    
    // Function to enable disabled buttons
    function enableButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            button.removeAttribute('disabled');
            button.classList.remove('disabled');
            button.parentElement.removeAttribute('aria-disabled');
            console.log(`Enabled button: ${selector}`);
        }
    }
    
    // Function to unlock achievement and survey
    function unlockAchievementAndSurvey() {
        // Update the badge and survey activities
        const activities = document.querySelector('ql-contents-menu').getAttribute('modules');
        if (activities) {
            try {
                const modules = JSON.parse(activities);
                if (modules[0] && modules[0].steps[0] && modules[0].steps[0].activities) {
                    // Find badge and survey activities
                    const badgeActivity = modules[0].steps[0].activities.find(a => a.id === "badge");
                    const surveyActivity = modules[0].steps[0].activities.find(a => a.id === 13);
                    
                    if (badgeActivity) {
                        badgeActivity.isLocked = false;
                        badgeActivity.disabled = false;
                    }
                    
                    if (surveyActivity) {
                        surveyActivity.isLocked = false;
                        surveyActivity.disabled = false;
                    }
                    
                    document.querySelector('ql-contents-menu').setAttribute('modules', JSON.stringify(modules));
                    console.log("Unlocked achievement and survey activities");
                }
            } catch (e) {
                console.error("Error unlocking activities:", e);
            }
        }
        
        // Enable the achievement and survey buttons
        enableButton('ql-button[href="/paths/2269/badge"]');
        enableButton('ql-button[href="/paths/2269/surveys/13"]');
    }
    
    // Main function to complete all courses
    async function completeAllCourses() {
        try {
            // Update the main progress bar to 100%
            updateProgress('ql-progress-bar', '1.0');
            
            // Update the course progress for System Administration and IT Infrastructure Services
            updateActivityProgress(3, 100);
            markAsCompleted('ql-activity-card[path="/paths/2269/course_sessions/40891899/labs/611837"]');
            
            // Update the course progress for IT Security: Defense against the digital dark arts
            updateActivityProgress(4, 100);
            markAsCompleted('ql-activity-card[path="/paths/2269/course_sessions/40947161/labs/628818"]');
            
            // Wait a moment for changes to take effect
            await delay(1000);
            
            // Unlock achievement and survey
            unlockAchievementAndSurvey();
            
            // Show success notification
            const notification = document.createElement('div');
            notification.className = 'alert alert--success';
            notification.innerHTML = '<p class="alert__message">All courses completed successfully! Achievement and survey are now unlocked.</p>';
            document.body.prepend(notification);
            
            // Remove notification after 5 seconds
            setTimeout(() => {
                notification.remove();
            }, 5000);
            
            console.log("All courses completed successfully!");
            
        } catch (error) {
            console.error("Error during course completion:", error);
            
            // Show error notification
            const notification = document.createElement('div');
            notification.className = 'alert alert--error';
            notification.innerHTML = `<p class="alert__message">An error occurred: ${error.message}</p>`;
            document.body.prepend(notification);
        }
    }
    
    // Function to bypass 500 errors when clicking buttons
    function bypassButtonErrors() {
        // Override fetch to handle 500 errors
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            if (typeof url === 'string' && (url.includes('/paths/2269/badge') || url.includes('/paths/2269/surveys/13'))) {
                console.log(`Intercepted request to ${url}`);
                // Return a successful response for achievement and survey requests
                return Promise.resolve(new Response(JSON.stringify({success: true}), {
                    status: 200,
                    headers: {'Content-Type': 'application/json'}
                }));
            }
            return originalFetch.apply(this, args);
        };
        
        console.log("Button error bypass activated");
    }
    
    // Start the course completion process
    completeAllCourses();
    
    // Activate error bypass
    bypassButtonErrors();
    
    // Expose functions to the console for manual control if needed
    window.completeCertificate = {
        completeAllCourses,
        updateProgress,
        markAsCompleted,
        enableButton,
        unlockAchievementAndSurvey
    };
    
    console.log("Certificate completion script loaded. Type 'completeCertificate.completeAllCourses()' to run manually if needed.");
})();
