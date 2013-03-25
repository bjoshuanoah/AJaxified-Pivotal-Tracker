
{{#each members}}

    {{#if unique_id}}
        <div class="user_column" member_id="{{unique_id}}">
            <div class="user_stories" >
                {{#each stories}}
                    <div id="{{id}}" class="user_story" difficulty="{{estimate}}" status="{{current_state}}" accepted_ts='{{ts}}' project_id="{{project_id}}" {{#if type}}type="week_indicator" week_number="{{week_number}}"{{/if}}>
                        {{#if type}}
                            <span class="date">{{start_month_name}} {{start_day}} {{start_year}}</span><span class="personal_velocity"></span>
                        {{else}}
                            <span>{{name}}</span>
                            <footer>
                                Difficulty: <span class="estimate">{{estimate}}</span> | Status: {{current_state}} | Id: <a href="https://www.pivotaltracker.com/story/show/{{id}}" target="_blank">{{id}}</a>
                            </footer>
                        {{/if}}
                    </div>
                {{/each}}
            </div>
        </div>
    {{/if}}
{{/each}}

