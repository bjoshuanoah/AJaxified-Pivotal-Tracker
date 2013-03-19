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
