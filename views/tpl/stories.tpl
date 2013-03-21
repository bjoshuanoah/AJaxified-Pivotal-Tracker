
{{#each members}}
    {{#if unique_id}}
        <div class="user_column" id="{{unique_id}}">
            <header>{{name}}</header>
            <div class="user_stories" >
                {{#each stories}}
                    <div id="{{id}}" class="user_story" difficulty="{{estimate}}" status="{{current_state}}" accepted_ts='{{ts}}'>
                        <span>{{name}}</span>
                        <footer>
                            Difficulty: {{estimate}} | Status: {{current_state}} | Id: <a href="https://www.pivotaltracker.com/story/show/{{id}}" target="_blank">{{id}}</a>
                        </footer>
                    </div>
                {{/each}}
            </div>
        </div>
    {{/if}}
{{/each}}

