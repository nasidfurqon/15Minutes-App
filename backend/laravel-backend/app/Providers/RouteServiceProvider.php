<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Route untuk API
        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));

        // Route untuk web
        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    }
}
