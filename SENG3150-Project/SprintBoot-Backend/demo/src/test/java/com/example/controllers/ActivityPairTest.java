package com.example.controllers;

import com.example.controllers.ActivityPair;
import com.example.entities.Activity;

import org.junit.jupiter.api.Test;

public class ActivityPairTest {
    
    @Test
    public void activityPairGetter1_success(){
        Activity activity1 = new Activity();
        Activity activity2 = new Activity();
        ActivityPair activityPair = new ActivityPair(activity1, activity2);

        assert(activityPair.getOriginalActivity() == activity1);
    }

    @Test
    public void activityPairGetter2_success(){
        Activity activity1 = new Activity();
        Activity activity2 = new Activity();
        ActivityPair activityPair = new ActivityPair(activity1, activity2);

        assert(activityPair.getChangedActivity() == activity2);
    }

    @Test
    public void activityPairSetter1_success(){
        Activity activity1 = new Activity();
        ActivityPair activityPair = new ActivityPair();

        activityPair.setOriginalActivity(activity1);

        assert(activityPair.getOriginalActivity() == activity1);
    }

    @Test
    public void activityPairSetter2_success(){
        Activity activity2 = new Activity();
        ActivityPair activityPair = new ActivityPair();

        activityPair.setChangedActivity(activity2);

        assert(activityPair.getChangedActivity() == activity2);
    }
}
