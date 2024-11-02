// Find all our documentation at https://docs.near.org
use near_sdk::{log, near};


// Define the contract structure
#[near(contract_state)]
pub struct Contract {
    greeting: String,
    prompts: UnorderedMap<u64, String>,    // Store prompts with unique IDs
    responses: UnorderedMap<u64, String>,  // Store AI responses based on prompts
    next_id: u64,              
}

// Define the default, which automatically initializes the contract
impl Default for Contract {
    fn default() -> Self {
        Self {
            greeting: "Hello".to_string(),
        }
    }
}

// Implement the contract structure
#[near]
impl Contract {
    // Public method - returns the greeting saved, defaulting to DEFAULT_GREETING
    pub fn get_greeting(&self) -> String {
        self.greeting.clone()
    }

    // Public method - accepts a greeting, such as "howdy", and records it
    pub fn set_greeting(&mut self, greeting: String) {
        log!("Saving greeting: {greeting}");
        self.greeting = greeting;
    }
    // Function to create a new prompt and simulate AI response generation
    pub fn create_prompt(&mut self, prompt: String) -> String {
        let id = self.next_id;                 // Get the current ID
        self.prompts.insert(&id, &prompt);     // Store the prompt
        self.next_id += 1;                     // Increment next ID

        log!("Creating prompt with ID: {} and prompt: {}", id, prompt); // Log the prompt

        // Simulate AI response generation
        let response = self.call_ai(prompt);
        self.responses.insert(&id, &response); // Store AI response
        
        response // Return the generated AI response
    }

    // Simulated function to mimic AI call (replace with actual AI call logic)
    fn call_ai(&self, prompt: String) -> String {
        // Log that a request is being sent to the AI service
        log!("Sending prompt to AI service: {}", prompt);
        // Return a placeholder response
        format!("AI response for prompt: {}", prompt)
    }

    // Function to retrieve the AI response by prompt ID
    pub fn get_response(&self, id: u64) -> Option<String> {
        self.responses.get(&id) // Retrieve the AI response by ID
    }

    // Function to retrieve the prompt by ID
    pub fn get_prompt(&self, id: u64) -> Option<String> {
        self.prompts.get(&id) // Retrieve the prompt by ID
    }

    // Function to get all prompts (optional)
    pub fn get_all_prompts(&self) -> Vec<(u64, String)> {
        self.prompts.iter().collect() // Collect all prompts as a vector of tuples
    }

    // Function to get all responses (optional)
    pub fn get_all_responses(&self) -> Vec<(u64, String)> {
        self.responses.iter().collect() // Collect all responses as a vector of tuples
    }
}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 */
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn get_default_greeting() {
        let contract = Contract::default();
        // this test did not call set_greeting so should return the default "Hello" greeting
        assert_eq!(contract.get_greeting(), "Hello");
    }

    #[test]
    fn set_then_get_greeting() {
        let mut contract = Contract::default();
        contract.set_greeting("howdy".to_string());
        assert_eq!(contract.get_greeting(), "howdy");
    }
}
