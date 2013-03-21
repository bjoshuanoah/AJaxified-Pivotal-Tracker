{{#if membership.id}}
    <div class="user_column" id="{{member.unique_id}}">
        <header>{{member.person.name}}</header>
        <div class="user_stories"></div>
    </div>
{{else}}
    {{#each membership}}
        {{#if unique_id}}
            <div class="user_column" id="{{unique_id}}">
                <header>{{person.name}}</header>
                <div class="user_stories"></div>
            </div>
        {{/if}}
    {{/each}}
{{/if}}
