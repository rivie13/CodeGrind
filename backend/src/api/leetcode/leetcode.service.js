import { LeetCode } from 'leetcode-query';

const leetcode = new LeetCode();

export const leetcodeService = {
  async getProblems(difficulty = null) {
    const query = {
      query: `
        query problemsetQuestionList {
          allQuestions: allQuestionsRaw {
            titleSlug
            title
            questionFrontendId
            difficulty
            status
            isPaidOnly
          }
        }
      `
    };
    
    const response = await leetcode.graphql(query);
    let questions = response.data.allQuestions;
    
    if (difficulty) {
      questions = questions.filter(q => 
        q.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }
    
    return questions;
  },

  async getProblemBySlug(titleSlug) {
    const query = {
      query: `
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId
            questionFrontendId
            title
            titleSlug
            content
            difficulty
            codeSnippets {
              lang
              langSlug
              code
            }
          }
        }
      `,
      variables: {
        titleSlug
      }
    };
    
    const response = await leetcode.graphql(query);
    return response.data.question;
  }
}; 