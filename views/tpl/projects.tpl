
{{#if project.length}}
 {{#each project}}
<div class="project" id="{{id}}">
    <header>
        {{name}}
    </header>
    <div>
        <div class="info">
            <span class="value">{{current_iteration_number}}</span><span class="key">Current Iteration:</span>
        </div>
        <div class="info">
            <span class="value">{{iteration_length}}</span><span class="key">Iteration Length:</span>
        </div>
        <div class="info">
        <span class="value">{{current_velocity}}</span><span class="key">Current Velocity</span>
        </div>
        <div class="info">
            <span class="value">{{initial_velocity}}</span><span class="key">Estimated Velocity</span>
        </div>
    </div>
</div>
{{/each}}
{{else}}
    {{#if project.id}}
        <div class="project" id="{{project.id}}">
            <header>
                {{project.name}}
            </header>
            <div>
                <div class="info">
                    <span class="value">{{project.current_iteration_number}}</span><span class="key">Current Iteration:</span>
                </div>
                <div class="info">
                    <span class="value">{{project.iteration_length}}</span><span class="key">Iteration Length:</span>
                </div>
                <div class="info">
                <span class="value">{{project.current_velocity}}</span><span class="key">Current Velocity</span>
                </div>
                <div class="info">
                    <span class="value">{{project.initial_velocity}}</span><span class="key">Estimated Velocity</span>
                </div>
            </div>
        </div>
        {{else}}
            <div class="project">
                <header>Sorry, no projects yet</header>
            </div>
        {{/if}}
{{/if}}
























