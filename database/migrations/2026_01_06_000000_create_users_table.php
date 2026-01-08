<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('verify_code')->nullable();
            $table->timestamp('expired_code_at')->nullable();
            $table->string('role_id');
            $table->enum('status', ['active', 'inactive', 'pending'])->default('active');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone_number', 10)->nullable();
            $table->string('address')->nullable();
            $table->date('dob')->nullable();
            $table->rememberToken();
            $table->timestamps();

            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
