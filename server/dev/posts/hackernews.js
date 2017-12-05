import r from "rethinkdb";
import request from "superagent";

export async function fetchHackernews(conn) {
    // all stories
    const storiesData = await request.get(
        "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty"
    );
    const stories = storiesData.body;

    // single story
    stories.map(async s => {
        const storyData = await request.get(
            `https://hacker-news.firebaseio.com/v0/item/${s}.json?print=pretty`
        );
        const story = storyData.body;

        r
            .db("devread")
            .table("hackernews")
            .insert([story])
            .run(conn, (err, res) => {
                if (err) console.log(err);
                console.log(res);
            });
    });
}
