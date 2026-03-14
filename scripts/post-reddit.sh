#!/bin/bash
# Reddit Posting Script for Open Code Review
# Usage: ./post-reddit.sh <subreddit> <post-file>
#
# Prerequisites:
# 1. Create Reddit "script" app at https://www.reddit.com/prefs/apps
# 2. Set environment variables:
#    REDDIT_CLIENT_ID=your_client_id
#    REDDIT_CLIENT_SECRET=your_client_secret
#    REDDIT_USERNAME=your_username
#    REDDIT_PASSWORD=your_password

set -e

SUBREDDIT="$1"
POST_FILE="$2"

if [ -z "$SUBREDDIT" ] || [ -z "$POST_FILE" ]; then
    echo "Usage: $0 <subreddit> <post-file>"
    echo "Example: $0 programming post1.md"
    echo ""
    echo "Available posts:"
    echo "  r/programming  - promotion/content/reddit-posts.md (Post 1)"
    echo "  r/codesecurity - promotion/content/reddit-posts.md (Post 2)"
    echo "  r/devops       - promotion/content/reddit-posts.md (Post 3)"
    echo "  r/javascript   - promotion/content/reddit-posts.md (Post 4)"
    echo "  r/webdev       - promotion/content/reddit-posts-extra.md (Post 5)"
    echo "  r/typescript   - promotion/content/reddit-posts-extra.md (Post 6)"
    exit 1
fi

# Check credentials
if [ -z "$REDDIT_CLIENT_ID" ] || [ -z "$REDDIT_CLIENT_SECRET" ]; then
    echo "❌ Reddit API credentials not set."
    echo ""
    echo "To configure:"
    echo "  1. Go to https://www.reddit.com/prefs/apps"
    echo "  2. Create a 'script' app"
    echo "  3. Set environment variables:"
    echo "     export REDDIT_CLIENT_ID=<client_id>"
    echo "     export REDDIT_CLIENT_SECRET=<client_secret>"
    echo "     export REDDIT_USERNAME=<username>"
    echo "     export REDDIT_PASSWORD=<password>"
    exit 1
fi

echo "📱 Posting to r/$SUBREDDIT..."

# Get access token
TOKEN_RESPONSE=$(curl -s -X POST https://www.reddit.com/api/v1/access_token \
    --user "$REDDIT_CLIENT_ID:$REDDIT_CLIENT_SECRET" \
    -d "grant_type=password&username=$REDDIT_USERNAME&password=$REDDIT_PASSWORD" \
    -A "open-code-review-bot/1.0")

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.access_token')

if [ "$ACCESS_TOKEN" = "null" ] || [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Failed to get access token. Check credentials."
    echo "Response: $TOKEN_RESPONSE"
    exit 1
fi

echo "✅ Authenticated successfully"

# Extract title and body from post file
TITLE=$(grep '^\*\*Title:\*\*' "$POST_FILE" | sed 's/\*\*Title:\*\* //')
BODY=$(awk '/^\*\*Body:\*\*$/{found=1; next} found' "$POST_FILE")

if [ -z "$TITLE" ] || [ -z "$BODY" ]; then
    echo "❌ Could not extract title/body from $POST_FILE"
    exit 1
fi

echo "📝 Title: $TITLE"
echo ""

# Submit post
RESPONSE=$(curl -s -X POST https://oauth.reddit.com/api/submit \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "User-Agent: open-code-review-bot/1.0" \
    -d "sr=$SUBREDDIT" \
    -d "title=$TITLE" \
    -d "text=$BODY" \
    -d "kind=self" \
    -d "api_type=json")

SUCCESS=$(echo "$RESPONSE" | jq -r '.success // .json.errors')

if [ "$SUCCESS" = "true" ]; then
    POST_URL=$(echo "$RESPONSE" | jq -r '.json.data.url')
    echo "✅ Posted successfully!"
    echo "🔗 $POST_URL"
else
    echo "❌ Post failed"
    echo "Response: $RESPONSE"
fi
